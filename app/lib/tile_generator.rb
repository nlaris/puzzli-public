module TileGenerator

  WIDTH = 450

  TOP_LEFT = "0,0"
  TOP_CENTER = "#{WIDTH / 2},0"
  TOP_RIGHT = "#{WIDTH},0"
  CENTER_LEFT = "0,#{WIDTH / 2}"
  CENTER_CENTER = "#{WIDTH / 2},#{WIDTH / 2}"
  CENTER_RIGHT = "#{WIDTH},#{WIDTH / 2}"
  BOTTOM_LEFT = "0,#{WIDTH}"
  BOTTOM_CENTER = "#{WIDTH / 2},#{WIDTH}"
  BOTTOM_RIGHT = "#{WIDTH},#{WIDTH}"

  # Tile patterns start from the left-upper triangle, and go clockwise from there
  # For example, BBBBWWWW represents a tile that has a black upper half, and a white lower half
  COORDS = [
    [CENTER_CENTER, TOP_LEFT, CENTER_LEFT],
    [CENTER_CENTER, TOP_LEFT, TOP_CENTER],
    [CENTER_CENTER, TOP_RIGHT, TOP_CENTER],
    [CENTER_CENTER, TOP_RIGHT, CENTER_RIGHT],
    [CENTER_CENTER, BOTTOM_RIGHT, CENTER_RIGHT],
    [CENTER_CENTER, BOTTOM_RIGHT, BOTTOM_CENTER],
    [CENTER_CENTER, BOTTOM_LEFT, BOTTOM_CENTER],
    [CENTER_CENTER, BOTTOM_LEFT, CENTER_LEFT],
  ].freeze

  # Generate the webp files for all tile patterns
  # SVGs allow us to build the images from scratch, but we want webps for better loading
  def self.generate_all_tile_svgs
    Constants::PATTERNS.each do |pattern|
      svg = create_tile_svg(pattern)
      convert_svg_to_webp(svg.render, "frontend/src/images/tiles/#{pattern}.webp")
    end
  end

  def self.create_tile_svg(pattern)
    raise "Invalid pattern" if pattern.length != 8 || pattern.delete("WB").length > 0
    svg = Victor::SVG.new width: WIDTH, height: WIDTH

    # Generating it one color at a time to avoid weird overlaps of colors when applying black stroke
    svg.build do
      w_indices = pattern.each_char.with_index.select { |char, index| char === 'W' }.map { |char, index| index }
      b_indices = pattern.each_char.with_index.select { |char, index| char === 'B' }.map { |char, index| index }
      w_indices.each do |index|
        polygon points: COORDS[index], fill: 'white', stroke: 'none'
      end
      b_indices.each do |index|
        polygon points: COORDS[index], fill: 'black', stroke_width: 2, stroke: 'black'
      end
    end

    svg
  rescue => e
    Rails.logger.error(e)
    nil
  end

  def self.convert_svg_to_webp(svg_content, output_file)
    image = MiniMagick::Image.read(svg_content)
    image.format 'webp'
    image.write output_file
  end
end